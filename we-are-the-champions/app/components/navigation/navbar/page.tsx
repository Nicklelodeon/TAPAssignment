
import React from "react";
import Link from "next/link";


const NavBar = () => {
  return (
    <>
      <div className="w-full h-20  sticky top-0 border border-black">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <ul className="hidden md:flex gap-x-6 text-black">
              <li>
                <Link href="/matches">
                  <p>View Recent Matches</p>
                </Link>
              </li>
              <li>
                <Link href="/manage">
                  <p>Manage Data</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar

