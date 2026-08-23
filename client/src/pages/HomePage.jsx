import React, { useEffect, useState } from 'react';
import { DropDown } from '../components/DropDown';
import { PressResults } from '../components/PressResults';
import { Header } from '../components/Header';
import { axiosInstance } from '../lib/axios';

const HomePage = () => {
  const [selectedClub, setSelectedClub] = useState(null);
  const [data,setData] = useState(null);
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    const fetchData = async()=>{
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await axiosInstance.get(`/api/${selectedClub}`);
        if (res.data.success){
          setData(res.data.data);
      }
    } catch (error) {
        setError(error.message);
      }finally{
        setLoading(false);
      }

    }
    if(selectedClub){

      fetchData();
    }

  },[selectedClub])


const teams = {
    "Leeds": { name:"Leeds United", manager : "Daniel Farke"},
    "Arsenal":           { name: "Arsenal",             manager: "Mikel Arteta" },
  // "Aston Villa":       { name: "Aston Villa",         manager: "..." },
  "Bournemouth":       { name: "AFC Bournemouth",     manager: "Marco Rose" },
  // "Brentford":         { name: "Brentford FC",        manager: "..." },
  "Brighton":          { name: "Brighton & Hove Albion",manager: "Fabian Hurzeler" },
  "Chelsea":           { name: "Chelsea FC",          manager: "Xabi Alonso" },
  // "Crystal Palace":    { name: "Crystal Palace",      manager: "..." },
  "Everton":           { name: "Everton",             manager: "David Moyes" },
  "Fulham":            { name: "Fulham FC",           manager: "Alvaro Arbeloa" },
  // "Burnley":           { name: "Burnley",        manager: "Scott Parker" },
  "Sunderland":         { name: "Sunderland",      manager: "Regis Le Bris" },
  "Liverpool":         { name: "Liverpool FC",        manager: "Andoni Iraola" },
  "Man City":          { name: "Manchester City",     manager: "Enzo Maresca" }, 
  "Man Utd":           { name: "Manchester United",   manager: "Michael Carrick" }, 
  "Newcastle":         { name: "Newcastle United",    manager: "Matthias Jaissle" },
  "Nott'm Forest":     { name: "Nottingham Forest",   manager: "Oliver Glasner" },
  // "Hull City":        {name:"Hull City" , manager: "Sergej Jakirović"},
  "Coventry City":    {name:"Coventry City", manager: "Frank Lampard"},
  // "Ipswich Town":     {name:"Ipswich Town", manager:"Gary O'Neil"}, 
  // "Spurs":             { name: "Tottenham Hotspur",   manager: "Thomas Frank (SACKED)" }, 
  // "West Ham":          { name: "West Ham United",     manager: "Nuno Espirito Santo" },
  // "Wolves":            { name: "Wolverhampton",       manager: "..." }
}
  
  const clubList = Object.entries(teams).map(([key,value])=>({
    id : key,
    value : value.name,
  }));

  const managerName = selectedClub?teams[selectedClub].manager : null;

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black p-4 md:p-10 font-sans selection:bg-black selection:text-white">
      <div className="max-w-3xl mx-auto">
        
        
        <Header />

        <DropDown 
          clubs={clubList} 
          onSelect={setSelectedClub} 
        />

        <PressResults data={data} isloading={loading} error={error}  currentManager={managerName}/>

      </div>
    </div>
  );
};

export default HomePage;