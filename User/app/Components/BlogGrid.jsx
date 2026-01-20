"use client";

import { Grid, Box } from "@mui/material";
import BlogCard from "./BlogCards";

export default function BlogGrid({ blogs }) {
  return (
    <Box sx={{ px: 3, py: 8 }}>
      <Grid container spacing={4}>
        {blogs.map((blog, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <BlogCard blog={blog} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
