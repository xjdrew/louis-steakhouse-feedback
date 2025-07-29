import { Metadata } from "next";

export function generateFeedbackDetailMetadata(
  feedbackId: string,
  name?: string,
  rating?: number,
  content?: string
): Metadata {
  const title = name 
    ? `${name}'s Feedback - Louis' Steak House`
    : `Feedback #${feedbackId.slice(0, 8)} - Louis' Steak House`;
  
  const description = content 
    ? `${content.slice(0, 150)}${content.length > 150 ? '...' : ''}`
    : `View customer feedback and rating for Louis' Steak House dining experience.`;

  const ratingText = rating ? ` Rating: ${rating}/5 stars.` : '';

  return {
    title,
    description: description + ratingText,
    openGraph: {
      title,
      description: description + ratingText,
      type: 'article',
      url: `/feedback/${feedbackId}`,
    },
    twitter: {
      card: 'summary',
      title,
      description: description + ratingText,
    },
  };
}

export function generatePageMetadata(
  title: string,
  description: string,
  path?: string
): Metadata {
  const fullTitle = `${title} - Louis' Steak House`;
  
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url: path ? `/${path}` : undefined,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  };
}