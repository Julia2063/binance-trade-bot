import './InfoItem.scss';

export const InfoItem = ({ title, text, clTitle, clText, Img, clImg }) => {
    return (
        <div className="infoItem">
            <img src={Img} alt='' className={clImg}/>
            <p className={clTitle}>{title}</p>
            <p className={clText}>{text}</p>
        </div>
    )
}