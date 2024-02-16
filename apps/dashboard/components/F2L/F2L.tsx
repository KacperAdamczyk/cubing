import {Face} from "@/components/Face";
import {Colors, algorithmToFaces} from "@repo/cube";
import type {FC} from "react";

interface Props {
    algorithm: string;
}

export const F2L: FC<Props> = ({algorithm}) => {
    const faces = algorithmToFaces({
        algorithm,
        orientation: {U: Colors.Y, F: Colors.R},
    });

    return (
        <div className="size-40 [perspective:800px]">
            <div className="relative size-full origin-center [transform-style:preserve-3d]">
                <Face
                    className="absolute size-[50%] [transform:scale(0.5)_rotateX(45deg)_translateZ(200px)]"
                    face={faces.U}
                    maskedColors={[]}
                />
                <Face
                    className="absolute size-[50%] [transform:scale(0.5)_translateZ(200px)]"
                    face={faces.F}
                    maskedColors={[]}
                />
                <Face
                    className="absolute size-[50%] [transform:scale(0.5)_rotateY(45deg)_translateZ(200px)]"
                    face={faces.R}
                    maskedColors={[]}
                />
            </div>
        </div>
    );
};
