import {FileExclamationPoint, House, MessageCircle} from "lucide-react";


export const Summary = () => {

    const blocks = [
        {
            heading: "0 Properties occupied",
            icon: <House />,
        },
        {
            heading: "Messages",
            icon: <MessageCircle />,
        },
        {
            heading: "Requests and Complaints",
            icon: <FileExclamationPoint />,
            description: "",
        },
    ]

    return (
        <div>
            <div className="summary-blocks-direction flex justify-between">
                {blocks.map((block, index) => (
                    <div key={index}>
                        <div className="summary-blocks aspect-video h-16 bg-white rounded-lg pt-4 pl-4  shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] border-2 border-[#e0e0e0] ">
                            <div className="flex gap-3 items-center">
                                {block.icon}
                                <div>
                                    {block.heading}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}