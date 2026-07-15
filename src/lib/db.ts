import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Application, ApplicationStatus, Payment, PaymentStatus } from "@/types/admissions";

let connection: DatabaseSync | null = null;

function database() {
  if (connection) return connection;
  const dataDir = path.join(process.cwd(), "data");
  mkdirSync(dataDir, { recursive: true });
  connection = new DatabaseSync(path.join(dataDir, "arizon-admissions.sqlite"));
  connection.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      university TEXT NOT NULL,
      courseOfStudy TEXT NOT NULL,
      programmingExperience TEXT NOT NULL,
      device TEXT NOT NULL,
      whyJoin TEXT NOT NULL,
      status TEXT NOT NULL,
      paymentStatus TEXT NOT NULL,
      studentStatus TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      applicationId TEXT,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      amountPaid INTEGER NOT NULL,
      dateOfPayment TEXT NOT NULL,
      paymentReference TEXT,
      receiptPath TEXT,
      status TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(applicationId) REFERENCES applications(id) ON DELETE SET NULL
    );
  `);
  return connection;
}

function now() {
  return new Date().toISOString();
}

function appFromRow(row: unknown): Application {
  return row as Application;
}

function paymentFromRow(row: unknown): Payment {
  return row as Payment;
}

export function createApplication(input: Omit<Application, "id" | "status" | "paymentStatus" | "studentStatus" | "createdAt" | "updatedAt">) {
  const db = database();
  const id = crypto.randomUUID();
  const timestamp = now();
  db.prepare(`
    INSERT INTO applications
    (id, fullName, email, phone, university, courseOfStudy, programmingExperience, device, whyJoin, status, paymentStatus, studentStatus, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Not Submitted', 'Applicant', ?, ?)
  `).run(
    id,
    input.fullName,
    input.email.toLowerCase(),
    input.phone,
    input.university,
    input.courseOfStudy,
    input.programmingExperience,
    input.device,
    input.whyJoin,
    timestamp,
    timestamp
  );
  return getApplication(id)!;
}

export function getApplication(id: string) {
  const row = database().prepare("SELECT * FROM applications WHERE id = ?").get(id);
  return row ? appFromRow(row) : null;
}

export function getApplicationByEmail(email: string) {
  const row = database().prepare("SELECT * FROM applications WHERE lower(email) = lower(?) ORDER BY createdAt DESC LIMIT 1").get(email);
  return row ? appFromRow(row) : null;
}

export function listApplications() {
  return database()
    .prepare("SELECT * FROM applications ORDER BY datetime(createdAt) DESC")
    .all()
    .map(appFromRow);
}

export function updateApplicationStatus(id: string, status: ApplicationStatus) {
  database()
    .prepare("UPDATE applications SET status = ?, updatedAt = ? WHERE id = ?")
    .run(status, now(), id);
  return getApplication(id);
}

export function updateApplicationPayment(id: string, paymentStatus: PaymentStatus, enrolled = false) {
  database()
    .prepare("UPDATE applications SET paymentStatus = ?, studentStatus = ?, updatedAt = ? WHERE id = ?")
    .run(paymentStatus, enrolled ? "Enrolled" : "Applicant", now(), id);
  return getApplication(id);
}

export function deleteApplication(id: string) {
  const db = database();
  db.prepare("UPDATE payments SET applicationId = NULL, updatedAt = ? WHERE applicationId = ?").run(now(), id);
  db.prepare("DELETE FROM applications WHERE id = ?").run(id);
}

export function createPayment(input: Omit<Payment, "id" | "applicationId" | "status" | "notes" | "createdAt" | "updatedAt">) {
  const db = database();
  const app = getApplicationByEmail(input.email);
  const id = crypto.randomUUID();
  const timestamp = now();
  db.prepare(`
    INSERT INTO payments
    (id, applicationId, fullName, email, phone, amountPaid, dateOfPayment, paymentReference, receiptPath, status, notes, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Awaiting Verification', NULL, ?, ?)
  `).run(
    id,
    app?.id ?? null,
    input.fullName,
    input.email.toLowerCase(),
    input.phone,
    input.amountPaid,
    input.dateOfPayment,
    input.paymentReference || null,
    input.receiptPath,
    timestamp,
    timestamp
  );
  if (app) updateApplicationPayment(app.id, "Awaiting Verification");
  return getPayment(id)!;
}

export function getPayment(id: string) {
  const row = database().prepare("SELECT * FROM payments WHERE id = ?").get(id);
  return row ? paymentFromRow(row) : null;
}

export function listPayments() {
  return database()
    .prepare("SELECT * FROM payments ORDER BY datetime(createdAt) DESC")
    .all()
    .map(paymentFromRow);
}

export function updatePaymentStatus(id: string, status: PaymentStatus, notes?: string) {
  database()
    .prepare("UPDATE payments SET status = ?, notes = COALESCE(?, notes), updatedAt = ? WHERE id = ?")
    .run(status, notes ?? null, now(), id);
  return getPayment(id);
}

export function latestPaymentForApplication(applicationId: string) {
  const row = database()
    .prepare("SELECT * FROM payments WHERE applicationId = ? ORDER BY datetime(createdAt) DESC LIMIT 1")
    .get(applicationId);
  return row ? paymentFromRow(row) : null;
}

export function adminPayload() {
  const applications = listApplications();
  const payments = listPayments();
  const revenueCollected = payments
    .filter((payment) => payment.status === "Verified")
    .reduce((total, payment) => total + payment.amountPaid, 0);

  return {
    applications,
    payments,
    stats: {
      totalApplications: applications.length,
      pendingApplications: applications.filter((app) => app.status === "Pending").length,
      approvedApplications: applications.filter((app) => app.status === "Approved").length,
      rejectedApplications: applications.filter((app) => app.status === "Rejected").length,
      awaitingPaymentVerification: payments.filter((payment) => payment.status === "Awaiting Verification").length,
      enrolledStudents: applications.filter((app) => app.studentStatus === "Enrolled").length,
      verifiedPayments: payments.filter((payment) => payment.status === "Verified").length,
      revenueCollected
    }
  };
}
