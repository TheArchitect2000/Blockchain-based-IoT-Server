import React from 'react'

function SvgLocation() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="600"
            height="600"
            viewBox="0 0 10000 10000"
        >
            <g fill="none" strokeMiterlimit="10" strokeWidth="1">
                <path
                    fill="#FF0000"
                    d="M45 90a4 4 0 01-3.444-1.966l-4.385-7.417C28.167 65.396 19.664 51.02 16.759 45.189a31.13 31.13 0 01-3.175-13.773C13.584 14.093 27.677 0 45 0s31.416 14.093 31.416 31.416c0 4.815-1.063 9.438-3.157 13.741-.025.052-.053.104-.08.155-2.961 5.909-11.41 20.193-20.353 35.309l-4.382 7.413A4 4 0 0145 90z"
                    transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                ></path>
                <path
                    fill="#FFF"
                    d="M45 45.678c-8.474 0-15.369-6.894-15.369-15.368S36.526 14.941 45 14.941s15.368 6.895 15.368 15.369S53.474 45.678 45 45.678z"
                    transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                ></path>
            </g>
        </svg>
    )
}

export default SvgLocation
