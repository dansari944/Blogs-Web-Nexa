"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

export default function BlogCard({ blog }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
      <Card
        sx={{
          height: "100%",
          borderRadius: 4,
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            height: 180,
            background:
              "linear-gradient(135deg, #667eea, #764ba2)",
          }}
        />

        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 1 }}
          >
            {blog.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {blog.excerpt}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}
