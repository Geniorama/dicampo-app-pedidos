import { CreateClient } from "@/app/views"
import { createClient } from "contentful"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"


const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  space: process.env.CONTENTFUL_SPACE_ID as string
})

const loadData = async () => {
  const res = await client.getEntries({
    content_type: 'client',
    include: 6,
  })

  return res.items
}

async function CreateClientPage(){
  const data = await loadData()

  return (
    <CreateClient 
      clients={data}
    />
  )
}

export default withPageAuthRequired(CreateClientPage)