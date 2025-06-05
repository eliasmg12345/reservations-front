'use client'
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HomePage() {

    const router = useRouter()
    return (
        <>
         <Box>
            ====HOME===
         </Box>
        </>
    )
}