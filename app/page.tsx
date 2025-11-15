export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        <h1 className="text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ContentForge
          </span>
        </h1>
        <p className="text-2xl text-muted-foreground mb-8">
          Turn one piece of content into an entire month of marketing
        </p>
        <p className="text-lg text-muted-foreground">
          AI-Powered Content Repurposing Platform
        </p>
      </div>
    </main>
  );
}
