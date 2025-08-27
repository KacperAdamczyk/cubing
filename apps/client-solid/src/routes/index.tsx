import { A, createAsync, query } from "@solidjs/router";
import { db, usersTable } from "db";
import Counter from "~/components/Counter";

const getUsers = query(async () => {
	"use server";
	const users = db.select().from(usersTable).all();

	return users;
}, "users");

export const route = {
	preload: () => getUsers(),
};

export default function Home() {
	const users = createAsync(() => getUsers());
	console.log(users());

	return (
		<main class="text-center mx-auto text-gray-700 p-4">
			<h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
				Hello world!
			</h1>
			<Counter />
			<p class="mt-8">
				Visit{" "}
				<a
					href="https://solidjs.com"
					target="_blank"
					class="text-sky-600 hover:underline"
					rel="noopener"
				>
					solidjs.com
				</a>{" "}
				to learn how to build Solid apps.
			</p>
			<p class="my-4">
				<span>Home</span>
				{" - "}
				<A href="/about" class="text-sky-600 hover:underline">
					About Page
				</A>{" "}
			</p>
		</main>
	);
}
