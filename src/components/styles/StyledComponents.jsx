import { keyframes, Skeleton, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";

export const VisuallyHiddenInput = styled("input")({
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1
});

export const Link = styled(LinkComponent)`
    text-decoration: none;
    color: black;
    padding: 1rem;
    &:hover {
        background-color: #f0f0f0;
    }
`
export const InputBox = styled("input")({
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    padding: "1rem 1rem",
    borderRadius: "1.5rem",
    backgroundColor: "whitesmoke",
    fontSize: "1rem"
})

export const SearchField = styled("input")`
    padding: 1rem 2rem;
    width: 20vmax;
    border: none;
    outline: none;
    border-radius: 1.5rem;
    background-color: #f1f1f1;
    font-size: 1.1rem
`   

export const CurveButton = styled("button")`
    border-radius: 1.5rem;
    border: none;
    outline: none;
    padding: 1rem 2rem;
    background-color: black;
    color: white;
    font-size: 1.1rem;
    &:hover {
        background-color: rgba(0,0,0,0.7)
    }
    cursor: pointer;
`
const bounceAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.5); }
    100% { transform: scale(1); }
`

export const BouncingSkeleton = styled(Skeleton)({
    animation: `${bounceAnimation} 1s infinite`,
    backgroundColor: "#9EDDFF"
})