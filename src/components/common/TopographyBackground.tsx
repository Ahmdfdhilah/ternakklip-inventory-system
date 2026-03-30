import React from "react";

export const TopographyBackground: React.FC = () => {
    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1440 590"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
            }}
            preserveAspectRatio="xMidYMid slice"
        >
            {/* Fine contour lines */}
            {[
                { d: "M-10,550 Q180,450 460,475 Q740,500 980,430 Q1210,365 1450,405", opacity: 0.12 },
                { d: "M-10,520 Q200,420 490,450 Q770,480 1010,400 Q1230,330 1450,375", opacity: 0.10 },
                { d: "M-10,490 Q220,390 510,425 Q790,460 1030,375 Q1245,300 1450,345", opacity: 0.12 },
                { d: "M-10,455 Q250,355 540,395 Q810,435 1060,345 Q1260,270 1450,315", opacity: 0.10 },
                { d: "M-10,420 Q270,320 570,365 Q840,410 1090,315 Q1275,240 1450,285", opacity: 0.10 },
                { d: "M-10,385 Q290,285 600,335 Q870,385 1120,280 Q1290,205 1450,250", opacity: 0.08 },
                { d: "M-10,350 Q310,250 630,300 Q900,350 1150,245 Q1305,170 1450,215", opacity: 0.08 },
                { d: "M-10,315 Q330,215 660,270 Q930,320 1180,210 Q1315,140 1450,182", opacity: 0.07 },
                { d: "M-10,280 Q350,180 690,240 Q960,295 1210,175 Q1325,110 1450,150", opacity: 0.06 },
                { d: "M-10,240 Q370,145 720,205 Q990,260 1240,140 Q1335,80 1450,115",  opacity: 0.05 },
            ].map((l, i) => (
                <path key={i} d={l.d} fill="none" stroke="white" strokeWidth={0.7} opacity={l.opacity} />
            ))}

            {/* Bold contour lines */}
            {[
                { d: "M-10,505 Q210,400 500,435 Q775,470 1015,390 Q1235,320 1450,365", opacity: 0.14 },
                { d: "M-10,415 Q265,315 565,360 Q840,405 1085,305 Q1272,228 1450,275", opacity: 0.12 },
                { d: "M-10,325 Q320,220 645,275 Q915,328 1165,220 Q1312,148 1450,190", opacity: 0.10 },
                { d: "M-10,235 Q375,130 735,192 Q1000,248 1248,128 Q1338,70 1450,108",  opacity: 0.08 },
            ].map((l, i) => (
                <path key={i} d={l.d} fill="none" stroke="white" strokeWidth={1.4} opacity={l.opacity} />
            ))}
        </svg>
    );
};
