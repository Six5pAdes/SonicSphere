import './Footer.css';
import { IoLogoGithub } from "react-icons/io5";
import { BsLinkedin } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";

const Footer = () => {
    return (
        <div className='footer-container'>
            <div className='footer-top'>
                <h2 className='contactme-txt'>Contact Me</h2>
                <a
                    href="https://github.com/Six5pAdes/SonicSphere"
                    target="_blank"
                    rel="noreferrer"
                    className="footer-link sonic-git"
                >
                    <IoLogoGithub className="github-logo" />
                    Sonic Sphere
                </a>
            </div>
            <div className="icons-contain">
                <div className="contact">
                    <a
                        href="https://github.com/Six5pAdes"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link"
                    >
                        <IoLogoGithub className="github-logo" />
                        Six5pAdes
                    </a>
                </div>
                <div className="contact">
                    <a
                        href="https://www.linkedin.com/in/austinhall-6spades/"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link"
                    >
                        <BsLinkedin className="linkedin-logo" />
                        Austin Hall
                    </a>
                </div>
                <div className="contact">
                    <a
                        href="https://six5pades.github.io/"
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link"
                    >
                        <CgWebsite className="website-logo" />
                        Portfolio
                    </a>
                </div>
            </div>
            <p id="copyright">© 2024</p>
        </div>
    )
}

export default Footer;
