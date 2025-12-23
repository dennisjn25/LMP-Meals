"use client";

import Image from 'next/image';

export default function AnimatedLogoBackground() {
    return (
        <div className="animated-logo-bg">
            {/* Main centered logo with glow */}
            <div className="logo-main">
                <Image
                    src="/logo.png"
                    alt="Liberty Meal Prep"
                    width={400}
                    height={400}
                    style={{ objectFit: 'contain', borderRadius: '50%' }}
                    priority
                />
            </div>

            {/* Duplicate logos for depth effect */}
            <div className="logo-layer logo-layer-1">
                <Image
                    src="/logo.png"
                    alt=""
                    width={300}
                    height={300}
                    style={{ objectFit: 'contain', borderRadius: '50%' }}
                />
            </div>

            <div className="logo-layer logo-layer-2">
                <Image
                    src="/logo.png"
                    alt=""
                    width={250}
                    height={250}
                    style={{ objectFit: 'contain', borderRadius: '50%' }}
                />
            </div>

            <div className="logo-layer logo-layer-3">
                <Image
                    src="/logo.png"
                    alt=""
                    width={350}
                    height={350}
                    style={{ objectFit: 'contain', borderRadius: '50%' }}
                />
            </div>

            <div className="logo-layer logo-layer-4">
                <Image
                    src="/logo.png"
                    alt=""
                    width={200}
                    height={200}
                    style={{ objectFit: 'contain', borderRadius: '50%' }}
                />
            </div>

            <div className="logo-layer logo-layer-5">
                <Image
                    src="/logo.png"
                    alt=""
                    width={400}
                    height={400}
                    style={{ objectFit: 'contain', borderRadius: '50%' }}
                />
            </div>

            {/* Gradient overlay for depth */}
            <div className="gradient-overlay"></div>
        </div>
    );
}
