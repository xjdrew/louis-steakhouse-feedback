-- Migration number: 0002 	 2025-07-29T03:44:17.300Z
-- Add likes and dislikes columns to feedback table
ALTER TABLE feedback ADD COLUMN likes INTEGER DEFAULT 0;
ALTER TABLE feedback ADD COLUMN dislikes INTEGER DEFAULT 0;
