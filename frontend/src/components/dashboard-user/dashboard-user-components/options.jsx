


export const Options = () => {

    const Opts = [
        {
            button: "Submit Notice",
        },
        {
            button: "Maintenance Request",
        },
        {
            button: "Payments",
        },
        {
            button: "Outstanding Balance",
        },

    ]


    return (
        <div className="mt-1">
            <div className="py-4 font-semibold text-xl">Options</div>
            <div className="flex flex-col gap-4">
                {Opts.map((Opt, index) => (
                    <div key={index}>
                        <div className="w-[363px] h-16 bg-white hover:bg-[#e0e0e0] hover:border-l-black cursor-pointer rounded-lg pt-4 pl-4  shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border-2 border-[#e0e0e0] transition-all duration-200">
                            <div className="flex">{Opt.button}</div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}