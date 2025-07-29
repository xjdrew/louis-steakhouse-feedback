import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View Feedback - Louis' Steak House",
  description: "Check the status of your feedback submission to Louis' Steak House. Track our response to your dining experience.",
  openGraph: {
    title: "View Feedback - Louis' Steak House",
    description: "Check the status of your feedback submission to Louis' Steak House. Track our response to your dining experience.",
  },
  twitter: {
    title: "View Feedback - Louis' Steak House",
    description: "Check the status of your feedback submission to Louis' Steak House. Track our response to your dining experience.",
  },
};

export default function ViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}