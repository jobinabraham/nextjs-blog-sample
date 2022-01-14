import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

// The file path to the directory where the markdown files are kept
const postDirectory = path.join(process.cwd(), "posts");

export const getSortedPostsData = () => {
  // Loop through all the files in the directory
  // Read each file content via gray matter
  // Return data of each file

  const filenames = fs.readdirSync(postDirectory);
  console.log("filenames", filenames);
  const allPostData = filenames.map((filename) => {
    const id = filename.replace(/\.md$/, "");

    const fullPath = path.join(postDirectory, filename);
    const fileContent = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContent);

    return {
      id,
      ...matterResult.data,
    };
  });

  return allPostData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
};

export const getAllPostIds = () => {
  //In this scenario Id are filenames
  const filenames = fs.readdirSync(postDirectory);

  return filenames.map((filename) => {
    const id = filename.replace(/\.md$/, "");
    return {
      params: {
        id,
      },
    };
  });
};

export const getPostData = async (id) => {
  const fullpath = path.join(postDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullpath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
};
