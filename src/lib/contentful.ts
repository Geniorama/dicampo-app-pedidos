import { createClient } from "contentful-management";

const contentfulClient  = createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN as string
})

export const getSpace = async () => {
    const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT!); // Generalmente "master"
    return environment;
};

export default contentfulClient;