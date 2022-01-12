
const Datas = ({ datas, handleSelect }) => {
    
    return (<p onClick={() => handleSelect(datas)} className="col-md-4" key={datas.arrayofitems} datas={datas} style={{backgroundColor: "rgb(131, 208, 238)",alignContent:"center",width:"220px",padding:"20px",borderRadius:"30px", cursor: "pointer" }}> Items to share: {datas.arrayofitems}</p>)
}

export default Datas