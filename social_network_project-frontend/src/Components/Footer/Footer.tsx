import "./FooterStyle.css";

export default function Footer()
{
    return <>
        <div className="footer">
            <div className="footerContent">

                <div className="footerLeft">
                    <span className="footerTitle">EtherLink</span>
                    <span className="footerText">© 2026 All rights reserved</span>
                </div>

                <div className="footerCenter">
                    <a href="#" className="footerLink">Contact Us</a>
                    <a href="#" className="footerLink">Privacy Policy</a>
                    <a href="#" className="footerLink">Terms</a>
                </div>

                <div className="footerRight">
                    <span className="footerText">Built with</span>
                </div>

            </div>
        </div>
    </>
}