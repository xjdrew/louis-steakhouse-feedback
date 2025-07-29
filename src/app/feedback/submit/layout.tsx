import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Feedback - Louis' Steak House",
  description: "Share your dining experience at Louis' Steak House. Rate your visit and help us improve our service.",
  openGraph: {
    title: "Submit Feedback - Louis' Steak House",
    description: "Share your dining experience at Louis' Steak House. Rate your visit and help us improve our service.",
  },
  twitter: {
    title: "Submit Feedback - Louis' Steak House",
    description: "Share your dining experience at Louis' Steak House. Rate your visit and help us improve our service.",
  },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}