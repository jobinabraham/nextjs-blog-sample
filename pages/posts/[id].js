// Create the componenet to be displayed for each post
// Use getStaticPaths to get all the available ids
// Use getStatProps to fetch data corresponding to the id

import Head from "next/head";
import { Date } from "../../components/date";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import utilStyles from "../../styles/utils.module.css";

export default function post({ postData }) {
  console.log("PostData", postData);
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  // Will need an api to fetch list of all Ids
  // return { paths:[], fallback: }

  const paths = getAllPostIds();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  console.log(context);
  // Will need an api to fetch details of each Id

  const { id } = context.params;
  const postData = await getPostData(id);
  return {
    props: {
      postData,
    },
  };
};
