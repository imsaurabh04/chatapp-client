import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'
import { transformImage } from '../../lib/features'

const AvatarCard = ({ avatar = [], max = 4 }) => {
    return (
        <Stack direction={"row"} spacing={0.5}>
                <AvatarGroup max={max} sx={{
                    width: "6rem",
                    height: "2.5rem",
                    position: "relative"
                }}>
                    {avatar.map((i, index) => (
                        <Avatar
                            key={Math.random() * 100}
                            src={transformImage(i)}
                            alt={`Avatar ${index}`}
                            sx={{
                                width: "2.5rem",
                                height: "2.5rem",
                                position: "absolute",
                                left: {
                                    xs: `${1 + index}rem`,
                                    sm: `${index}rem`
                                }
                            }}
                        />
                    ))}
                </AvatarGroup>
        </Stack>
    )
}

export default AvatarCard