export function HowItWorks() {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            How URL Shortening Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12">
            Shorten your links in seconds and start tracking performance instantly.
          </p>
  
          <div className="grid gap-8 md:grid-cols-4">
            
            {/* Card 1 */}
            <div className="group rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Paste Your Link</h3>
              <p className="text-slate-600 text-sm">
                Copy your long URL and paste it into the shortener input box.
              </p>
            </div>
  
            {/* Card 2 */}
            <div className="group rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Customize Alias</h3>
              <p className="text-slate-600 text-sm">
                Add a custom alias or branded domain to personalize your link.
              </p>
            </div>
  
            {/* Card 3 */}
            <div className="group rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Generate Short URL</h3>
              <p className="text-slate-600 text-sm">
                Click shorten and instantly get a compact, shareable link.
              </p>
            </div>
  
            {/* Card 4 */}
            <div className="group rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Performance</h3>
              <p className="text-slate-600 text-sm">
                Monitor clicks, locations, and devices with built-in analytics.
              </p>
            </div>
  
          </div>
        </div>
      </section>
    )
  }
  