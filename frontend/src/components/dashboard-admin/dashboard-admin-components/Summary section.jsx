import {House} from "lucide-react";


export const Summary = () => {

    const blocks = [
        {
            heading: "Properties occupied",
            icon: <House />
        },
        {
            heading: "Messages",
            icon: <House />
        },
        {
            heading: "Requests and Complaints",
            icon: <House />
        },
    ]

    return (
        <div>
            <div className="flex justify-between">
                {blocks.map((block, index) => (
                    <div key={index}>
                        <div className="w-xs h-20 bg-white ">
                            {block.heading}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}