import W from "wpapi"
import fastify from "fastify"
import formbody from "fastify-formbody"
import dot from "dotenv"

dot.config()

let w = new W({
	endpoint: "https://chee.snoot.club/wp-json",
	username: "chee",
	password: process.env.PUB_PASS,
})

let pub = fastify()

pub.register(formbody)

/**
 *
 * @param {KeyboardEvent} event
 */
function javascript(event) {
	if (event.key == "Enter" && !event.shiftKey) {
		event.preventDefault()
		form.submit()
	}
}

pub.get("/", async (q, reply) => {
	reply.headers({"content-type": "text/html"})
	reply.send(
		`
		<form id=form method=POST>
			<textarea onkeypress=javascript(event) autofocus autocomplete=off style=width:100%;height:100%;font-size:2em;padding:1em name=content></textarea>
		</form><script>window.javascript = ${javascript}</script>
		`
	)
})

pub.post("/", async (q, reply) => {
	let content = q.body.content
	let result = await w.posts().create({
		content,
		status: "publish",
	})
	reply.redirect(302, "/")
})

pub.listen(process.env.PUB_PORT || 3333)
