import Navbar from './Navbar';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container max-w-screen-lg mx-auto px-2 py-8 md:px-4">
        {children}
      </main>
      <footer className="py-6 text-center text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} InstaFocus. All rights reserved.
      </footer>
    </div>
  );
}
