-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow')),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(recipient_id, is_read);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = recipient_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE TO authenticated USING (auth.uid() = recipient_id);
