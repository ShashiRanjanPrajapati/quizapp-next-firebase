interface QuizLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function QuizLayout({ title, children }: QuizLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
