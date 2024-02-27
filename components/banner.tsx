
export default function Banner({url,name}:{url:string,name:any}) {
    return (
        <div style={{display:"flex",justifyContent:"center", overflow:"hidden",paddingBottom:"50px"}}>
            <div className="banner">
            <img src={url} alt={''} style={{objectFit: "cover", borderRadius: "15px",width:"100%",height:"18rem"}}/>
            <p style={{position: 'absolute',fontSize:"30px",fontFamily: "Gloria Hallelujah", top:"12rem",left:"10px", padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff',borderRadius:"30px"}}>{name}</p>
            </div>
        </div>
    )
}