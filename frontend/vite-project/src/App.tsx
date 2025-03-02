// npm run dev - to run file

import "./App.css"
import { useState } from "react";
import buildingsData from '../data.json';
import agsm from '../assets/agsm.webp';
import ainsworth from '../assets/ainsworth.webp';
import anitab from '../assets/anitab.webp';
import biologicalScience from '../assets/biologicalScience.webp';
import biologicalScienceWest from '../assets/biologicalScienceWest.webp';
import blockhouse from '../assets/blockhouse.webp';
import businessSchool from '../assets/businessSchool.webp';
import civilBuilding from '../assets/civilBuilding.webp';
import colombo from '../assets/colombo.webp';
import cseBuilding from '../assets/cseBuilding.webp';
import freeRoomsLogo from '../assets/freeRoomsLogo.png';
import freeRoomsDoorClosed from '../assets/freeRoomsDoorClosed.png';
import { Search } from 'lucide-react';

function App() {
    const [open, setOpen] = useState(true)

  const imageData = [agsm, ainsworth, anitab, biologicalScience, biologicalScienceWest, blockhouse, businessSchool, civilBuilding, colombo, cseBuilding];

  const buildings = buildingsData.map((building, index) => {
    return {
      ...building,
      img: imageData[index]
    };
  });

  const oppositeValue = () => {
    setOpen((prevValue) => !prevValue)
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 flex items-center border-b">
        <div className="flex items-center">
            <img className= "w-12 h-12" src={open ? freeRoomsLogo:freeRoomsDoorClosed}  onClick={oppositeValue}/>
          <h1 className="text-xl font-medium text-orange-500">Freerooms</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-5">
        <div className="mb-6 flex gap-4">
          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm">
            <span className="mr-2">▼</span>
            <span>Filters</span>
          </button>
          
          <div className="flex-grow relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search for a building..."
              className="block w-full px-10 py-2 border border-gray-300 rounded-md bg-white"
            />
          </div>
          
          <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm">
            <span className="mr-2">▼</span>
            <span>Sort</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {buildings.map((building) => (
            <div className="bg-white rounded-lg" >
              <div className="relative">
                <img 
                  src={building.img} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <div className="flex items-center bg-white rounded-full px-3 py-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs">
                      {building.rooms_available} rooms available
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-orange-500 text-white">
                <h3 className="font-medium">{building.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;