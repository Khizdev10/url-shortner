export default function Mainpage(props: any) {
  return (
    <div className="relative min-h-screen overflow-hidden">

<div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]" />

      {/* Wave Shape */}
      <svg
        className="absolute bottom-[-1] left-0 w-full"
        viewBox="0 0 1440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="white"
          d="M0,120 C120,160 240,80 360,90 480,100 600,160 720,150 840,140 960,60 1080,70 1200,80 1320,140 1440,120 L1440,200 L0,200 Z"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center text-white">

          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Premium URL Shortener
            </h1>
            <p className="opacity-80 mb-2">
              URL Shortener, Branded Short Links & Analytics
            </p>
            <p className="opacity-70">
              You can use branded domains for fully custom links, track link analytics,
              and enjoy other powerful features with our paid plans.
            </p>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-md">
            <form className="space-y-5">
                <p className="text-red-500 text-center hidden" id="aliasexistmsg">* Alias already in use. try something else</p>
                <label className="mb-2 font-semibold text-lg">Long URL</label>
              <input
                type="url"
                id="longUrl"
                placeholder="Paste a long URL"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-3">
                <select className="w-1/2 rounded-lg border border-gray-300 px-3 py-2">
                  <option>tinyurl.com</option>
                  <option>short.ly</option>
                </select>
                <input
                  type="text"
                  id="alias"
                  placeholder="alias"
                  className="w-1/2 rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>

              <button  onClick={(e)=>{
                e.preventDefault();
                props.handleShorten()}} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition">
                Shorten
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

