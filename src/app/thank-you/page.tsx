import { ThankYou } from "../views"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

async function ThankYouPage() {
  return (
    <ThankYou />
  )
}

export default withPageAuthRequired(ThankYouPage)
