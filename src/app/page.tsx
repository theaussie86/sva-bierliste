

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
           {/* Placeholder for SVA Logo if available, using text for now */}
          <h1 className="mt-6 text-4xl font-extrabold text-sva-dark uppercase tracking-tight sm:text-5xl">
            SVA <span className="text-sva-green">Bierliste</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Das digitale Getränkemanagement für den SV Amendingen.
          </p>
        </div>
        <div className="mt-8">
          <a
            href="/login"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-sva-green hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sva-green shadow-lg transition-all"
          >
            Anmelden
          </a>
        </div>
      </div>
    </div>
  );
}
