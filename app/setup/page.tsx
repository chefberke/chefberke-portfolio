import React from "react";

function Setup() {
  const equipment = [
    {
      name: "MacBook Air 13",
      specs: "M2, 8GB RAM, 256GB SSD",
      description:
        "My primary development machine, perfect for coding and content creation.",
    },
    {
      name: "Pusat Business Pro Mini",
      specs: "Wireless Keyboard",
      description:
        "Compact 75% wireless mechanical keyboard with minimalist design and smooth typing.",
    },
    {
      name: "VXE R1",
      specs: "Wireless Mouse",
      description:
        "Ergonomic mouse with precise tracking and customizable buttons.",
    },
    {
      name: "Asus VG27WQ1B",
      specs: '27" 2K VA Monitor',
      description:
        "Secondary display with excellent color accuracy and ergonomic stand.",
    },
    {
      name: "Apple AirPods",
      specs: "2nd Generation",
      description:
        "Wireless earbuds with great noise cancellation for focused work.",
    },
  ];

  return (
    <div>
      <div>
        <h2 className="text-xl font-medium">Setup</h2>
      </div>
      <div className="pt-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipment.map((item, index) => (
            <div
              key={index}
              className="bg-neutral-900/10 rounded-lg p-4 hover:bg-neutral-900/30 transition-all"
            >
              <h4 className="font-medium text-white mb-1">{item.name}</h4>
              <p className="text-sm text-neutral-400 mb-2">{item.specs}</p>
              <p className="text-sm text-gray-400 font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Setup;
