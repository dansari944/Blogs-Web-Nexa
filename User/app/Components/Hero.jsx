"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        px: 3,
        textAlign: "center",
        background:
          "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h2"
          fontWeight={800}
          sx={{ mb: 2, lineHeight: 1.2 }}
        >
          Blogs That Inspire, Educate & Convert
        </Typography>

        <Typography
          sx={{
            maxWidth: 720,
            mx: "auto",
            opacity: 0.9,
            fontSize: "1.15rem",
          }}
        >
          Deep insights, practical guides and real-world development
          experiences — crafted to keep you coming back.
        </Typography>

        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Button variant="contained" size="large">
            Explore Blogs
          </Button>
          <Button variant="outlined" size="large" color="inherit">
            Subscribe
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
}
