/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CubeMesh } from "@/components/CubeMesh";
import { Button, ButtonGroup } from "@nextui-org/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FC, useCallback, useEffect, useState } from "react";
import { TbPictureInPictureOn } from "react-icons/tb";

export interface ScrambleGeneratorContentProps {
	onPip: (promise: Promise<any> | undefined) => void;
	isPipDisabled?: boolean;
}

export const ScrambleGeneratorContent: FC<ScrambleGeneratorContentProps> = ({
	onPip,
	isPipDisabled = false,
}) => {
	const [isSupported, setIsSupported] = useState(false);
	const searchParams = useSearchParams();
	const scramble = searchParams.get("s");
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		setIsSupported("documentPictureInPicture" in window);
	}, []);

	const onOpenPip = useCallback(() => {
		const promise = (
			globalThis as any
		).documentPictureInPicture.requestWindow() as Promise<any>;

		onPip(promise);
	}, [onPip]);

	const onGenerateHandler = useCallback(() => {
		router.push(pathname);
	}, [router, pathname]);

	return (
		<div className="flex flex-col items-center gap-2">
			<ButtonGroup color="success">
				<Button onClick={onGenerateHandler}>Generate</Button>
				<Button
					isDisabled={!isSupported || !onPip || isPipDisabled}
					onClick={onOpenPip}
					isIconOnly
				>
					<TbPictureInPictureOn />
				</Button>
			</ButtonGroup>
			{scramble ? (
				<>
					<div className="text-2xl">{scramble}</div>
					<CubeMesh algorithm={scramble} />
				</>
			) : (
				<div className="flex justify-center text-4xl">No scramble</div>
			)}
		</div>
	);
};
