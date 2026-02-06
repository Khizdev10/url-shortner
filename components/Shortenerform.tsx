const Shortenerform = (props: any) => {
    return (

        <div className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="space-y-5">
                <p className="text-red-500 text-center hidden" id="aliasexistmsg">* Alias already in use. try something else</p>
                <label className="mb-2 font-semibold text-lg">Long URL</label>
                <input
                    type="url"
                    id="longUrl"
                    placeholder="Paste a long URL"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex gap-3">
                    <div className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 opacity-60">
                        <a>shortify.vercel.app/</a>
                    </div>
                    <input
                        type="text"
                        id="alias"
                        placeholder="alias"
                        className="w-1/2 rounded-lg border border-gray-300 px-3 py-2"
                    />
                </div>

                <button onClick={(e) => {
                    e.preventDefault();
                    props.handleShorten()
                }} id="shortenBtn" className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition">
                    Shorten
                </button>

                <div className="shortenedUrl bg-gray-50 rounded-lg p-6 hidden" id="shortenedUrlBox">
                    <p className="font-semibold opacity-60">Shortened URL</p>
                    <div className="flex justify-between items-center">
                        <a href="" id="shorturltext" className="text-blue-600" target="_blank"></a>
                        <button
                            id="copyBtn"
                            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg font-semibold transition"
                            onClick={props.copy}
                        >
                            Copy
                        </button>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Shortenerform