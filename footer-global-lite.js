// src/footer-global-lite.js
var FooterGlobalLite = class extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const fontLink = document.createElement("link");
    fontLink.setAttribute("rel", "stylesheet");
    fontLink.setAttribute("href", "https://fonts.googleapis.com/css2?family=Hind:wght@400;600&display=swap");
    shadow.appendChild(fontLink);
    const template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host {
            font-family: 'Hind', sans-serif;
            display: block;
            background-color: #062e47;
            color: #fff;
            }

            .footer-container {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            grid-template-rows: auto auto;
            gap: 10px;
            padding: 2rem;
            padding-right: 4rem;
            padding-bottom: 1rem;
            }

            .footer-bottom {
            grid-column: 1 / -1;
            text-align: left;
            padding-left: 4rem;
            margin-bottom: 0;
            }

            .footer-bottom a {
            color: inherit;
            }

            .footer-bottom a:hover {
            text-decoration: underline;
            }

            .footer-column {
            flex: 1 1 30%;
            margin: 0.5rem 0;
            }
            .footer-column:first-of-type {
                margin-left: 4rem;
            }

            @media (max-width: 800px) {
            .footer-column {
                flex: 1 1 100%;
            }
            }

            h2 {
                font-size:30px;
                margin-block-end: .83em;
                margin-block-end: 16px;
                margin-top: 24px;
                margin-bottom: 12px;
                font-weight: 500;
                line-height: 1.1;
                color: inherit;
                }

            a {
            color: inherit;
            text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }

            address {
                margin-bottom: 24px;
                font-style: normal;
                line-height: 1.5;
                unicode-bidi: isolate;
            }
            
            address a {
                display: block;
            }
            
            .u-email, .p-tell {
                line-height: 2;
            }

            .p-name {
                margin-block-start: 24px;
            }
            
            .social a svg {
                height: 32px;
            }

            .social a:not(:last-child) {
                margin-inline-end: 30px;
            }

            .logo {
                fill: #fff;
                margin-block: 24px;
                height: 5em;
            }
        
            .links {
                line-height: 2;
            }

            .list-unstyled {
                padding-left: 0;
                list-style: none;
            }

            ul {
                margin-top: 0;
            }

            .list-inline {
                padding-left: 0;
                list-style: none;
                margin-left: -5px;
            }
           
            .list-inline>li {
                display: inline-block;
                padding-right: 5px;
                padding-left: 5px;
            }

            .list-inline a {
                text-decoration: none;
            }
            
            ::slotted(.custom-footer-link) {
                color: white;
                text-decoration: none;
                padding: 5px;
                display: block;
            }

        </style>

        <footer class="footer-container">
            <div class="footer-column">
             <section class="links">
                    <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 190">
                    <path d="M72.52,26.4C68.66,9.47,56.28,1,40,1,15.83,1,1.67,20.6,1.67,43.44S14.12,85.94,40,85.94c16.13,0,26.93-7.84,33.4-24.09L59.57,55.49c-3,9.43-9,16.36-19.54,16.36-16.14,0-22.84-14.32-22.84-28.41S23.89,15,40,15c9.2,0,16.59,6.13,17.84,15.11L72.52,26.4Zm54.25,17.5C126.77,27.54,114.38,25,102,25c-12.61,0-24.54,5.22-24.54,18.74l13.86.57c0-6.25,2.61-8.63,10.68-8.63,6,0,10.91,1.59,10.91,7.27v1.7c-3.52,1.25-10,2.39-15,3.41l-5.8,1.14c-8.52,1.7-17.49,6.7-17.49,17.95s8.63,18.07,19.54,18.07a29.07,29.07,0,0,0,18.75-6.59,10.85,10.85,0,0,0,1.36,5.22h14.66c-.8-1.25-2.16-3.75-2.16-9.66V43.9ZM112.91,63.33c0,7.38-8.3,10.56-14.77,10.56-5,0-9-2.84-9-7.15,0-5.46,4.32-6.94,9.54-8l7.62-1.59a24.8,24.8,0,0,0,6.59-2v8.19Zm23.78,20.56h13.86V.72H136.69V83.89Zm23.23-70V70.71c0,8.75,3.86,13.86,15.22,13.86a51.43,51.43,0,0,0,11-1.36V71.85a59.08,59.08,0,0,1-6.14.68c-5.34,0-6.25-2.5-6.25-7V36.4h12.39v-10H173.78V0L159.92,13.88Zm84,44.56c0-20.57-8.4-33.4-27.61-33.4-18.63,0-29.43,13-29.43,30.1s10.8,30.12,29.43,30.12c15.68,0,24-7.5,28.3-14.09L232.9,64.35c-1.36,1.93-5.68,8.18-16.59,8.18-7.5,0-14.65-5.57-14.88-14.09ZM201.43,47.76A14.79,14.79,0,0,1,216.31,36.4c9.32,0,13.07,8.29,13.07,11.36ZM302.29,41.4C298.77,32.76,292,25,278,25c-18.63,0-29.43,13-29.43,30.1S259.34,85.26,277,85.26c15.57,0,22.16-9.21,26-17.62l-11.82-6.25c-2.15,5.23-5.68,11.14-14,11.14-9.66,0-14.09-8.41-14.09-17.39s5-17.38,14.88-17.38A12.78,12.78,0,0,1,290.13,47l12.16-5.56Zm4.32,42.49h13.86V54.35c0-7,3.18-15.91,13.63-15.91,7,0,10.23,3.41,10.23,11.36V83.89h13.86V45.83c0-16.71-11.25-20.79-21-20.79-7.84,0-13.41,3.06-16.47,7h-.23V.72H306.61V83.89Z"></path>
                    <path d="M16.1,129.71c0-5.34-.17-14.19-.25-15.69-.17-2.17-.58-3-3.09-3H8.84c-.5,0-.58-.41-.58-.83v-1.84c0-.41.08-.58.58-.58.92,0,3.92.25,10.85.25,8.09,0,11.6-.25,12.35-.25s.75.25.75.67v1.92c0,.41-.17.66-.83.66H27c-2.59,0-2.92.84-2.92,3.26,0,1.08-.25,13.68-.25,19.53V141c0,1.42,0,19.45.25,22.87,1.84.16,18.36.33,20.94,0,4.93-.75,9.93-10.77,11.1-14,.17-.34.34-.5.67-.34l1.34.5c.25.17.25.26.16.76-.25.58-3.59,14.35-4.09,16.6-1.08-.08-7.59-.16-15-.16s-15.6-.09-20.11-.09c-3.25,0-5.67.09-7.42.09s-2.67.16-3.26.16-.67-.16-.67-.58v-2.09c0-.42.09-.58.59-.58h4c3.09,0,3.59-1.17,3.59-2.26,0-1.58.25-22.36.25-27.45Z"></path>
                    <path d="M68.18,142.81c0-2.84-.5-4.34-4.67-5-.59-.08-.75-.25-.75-.58v-.75c0-.25.16-.42.58-.59a67.1,67.1,0,0,0,9-4.09,3.51,3.51,0,0,1,1.59-.5c.42,0,.5.42.42,1-.17,1.42-.17,6.68-.17,13.61V155c0,3.26,0,6.26.08,7.18.17,1.58.42,2.17,1.34,2.17h3.84c.66,0,.83.25.83.75v1.42c0,.58-.17.83-.75.83s-4.51-.25-8-.25c-4.84,0-8.1.25-9,.25-.42,0-.67-.16-.67-.67V165c0-.5.25-.66.83-.66h4.09c.92,0,1.25-.34,1.34-1.67.08-2.5.08-5.09.08-7.6Zm-3.92-25.62a4.92,4.92,0,0,1,5.26-4.67,4.39,4.39,0,0,1,4.5,4.42,4.78,4.78,0,0,1-5,4.92C67.1,121.86,64.26,119.94,64.26,117.19Z"></path>
                    <path d="M88,122.11c0-5.59-.92-6.76-3.92-7.76l-.84-.25c-.92-.25-1.08-.42-1.08-.67v-.66c0-.25.16-.42.67-.67a90.64,90.64,0,0,0,8.84-4.59,3.45,3.45,0,0,1,1.75-.75c.59,0,.76.42.67,1.42-.08.66-.08,10.18-.08,17.6v9.68c2.67-2.58,7.42-4.17,11.51-4.17,7.35,0,15.27,5.93,15.27,17.86,0,9.76-7.84,18.94-17.35,18.94-4.68,0-7.93-1-9.85-2.17l-3.34,1.84a1.2,1.2,0,0,1-1.08.25l-1-.25c-.34-.08-.42-.25-.34-.67.17-1.17.17-8.09.17-14.18Zm6,27c0,6.93.25,9.43,1.25,12.1.83,2,4.34,4.17,7.93,4.17,5,0,11.18-3.42,11.18-14.35,0-8.1-4.26-15.77-12.43-15.77a11.09,11.09,0,0,0-7.93,3Z"></path>
                    <path d="M132.11,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.91-.75h3.26c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                    <path d="M183.43,163.42a3.85,3.85,0,0,0,2.92-1.25c.34-.42.5-.59.83-.34l.84.67c.25.25.42.67-.08,1.5a6.89,6.89,0,0,1-6.51,4.09c-3,0-5.18-2.17-5.93-5.59h-.16a18,18,0,0,1-8.27,5.09,15.65,15.65,0,0,1-4.92.5c-2,0-5-1.67-5-6.92,0-3.84,1.76-7.18,8.35-10.1,3.75-1.67,8.09-3.67,9.43-4.84v-5.34c-.17-1.42-.25-3.59-1.17-4.67s-2.59-1.84-5-1.84a9.37,9.37,0,0,0-5.42,1.75c-1.17,1.09-.42,2.34-.42,3.84,0,2.92-1,4.76-4.42,4.76-1.34,0-2-.75-2-2.67,0-2.67,2.33-5.84,5.75-7.85a18.49,18.49,0,0,1,10.19-2.92c3.92,0,5.5,1.17,6.67,2.26,1.75,1.75,1.84,3.67,1.84,5.92v17.69C180.93,161.92,181.93,163.42,183.43,163.42Zm-8.59-14.69c-3,2.26-11.19,3.92-11.19,10.85,0,3.09,1.84,4.59,4.34,4.59s6.85-2.92,6.85-5.17Z"></path>
                    <path d="M196.62,144.89c0-4.25-.67-5.09-3-6.34l-1.58-.83c-.5-.17-.67-.25-.67-.59v-.5c0-.33.17-.5.67-.75l8.26-4.25a2.52,2.52,0,0,1,1.17-.34c.5,0,.58.5.58,1l.42,5.93h.33c2.51-3.84,6.43-7.26,10-7.26,2.84,0,4.25,1.75,4.25,3.67a4,4,0,0,1-3.5,4.09,5.39,5.39,0,0,1-2.42-.67,5.36,5.36,0,0,0-2.76-.67c-1.33,0-3.5.84-4.92,3.51a9,9,0,0,0-.83,2.67v17.36c0,2.58.58,3.42,2.33,3.42h3.93c.5,0,.58.25.58.75v1.5c0,.5-.08.75-.42.75-.5,0-4.34-.25-8.84-.25-5.18,0-8.68.25-9.18.25-.34,0-.5-.16-.5-.83v-1.42c0-.59.16-.75.92-.75h3.25c1.25,0,1.84-.5,1.84-1.59.08-2.75.08-5.67.08-10Z"></path>
                    <path d="M219.82,185.53c0-1.75,1.84-3.25,3.84-3.25a14.25,14.25,0,0,1,3.84.92,2,2,0,0,0,1.75-.5c1.25-1.51,5.51-11,6.68-14.27-.42-2.09-9.27-28.21-9.93-30-1-2.09-1.76-3.51-3.93-3.51H219.9c-.58,0-.67-.25-.67-.75v-1.67c0-.33.09-.58.67-.58.75,0,2.76.25,7.68.25,4.26,0,6.84-.25,7.76-.25.67,0,.75.25.75.58v1.76c0,.41-.08.66-.5.66H234c-.92,0-1.26.59-1.09,1.84.25,1.84,5.93,20.28,6.84,22.11h.34c.83-1.33,8.09-18.69,8.59-20.78s-.16-3.17-1.41-3.17h-1.34c-.5,0-.59-.25-.59-.66v-1.67c0-.42.09-.67.51-.67,1.08,0,2.83.25,6.84.25,2.25,0,4.17-.25,5.09-.25.5,0,.5.33.5.67v1.58c0,.5,0,.75-.42.75h-1.33a3.73,3.73,0,0,0-2.92,1.51c-1.84,2.25-7.35,15-13.11,28.12-4.08,9.26-7.34,17-8.84,19.77-1.17,2.18-2.67,5.43-7.09,5.43C221.41,189.79,219.82,188,219.82,185.53Z"></path>
                    </svg>

                    <address class="h-card">
                        <a class="u-email" href="mailto:library@caltech.edu">library@caltech.edu</a>
                        <a class="p-tel" href="tel:+16263953405">626-395-3405</a>
                    </address>
                    
                </section>
            </div>

            <div class="footer-column">
               <h2>Quick Links</h2>
                <div class="custom-links-wrapper">
                    <slot name="custom-links" part="custom-links">
                        <ul>
                            <li><a href="#">Default Link 1</a></li>
                            <li><a href="#">Default Link 2</a></li>
                        </ul>
                    </slot>
                </div>
            </div>

            
            <div class="footer-bottom">
            <ul class="list-inline">
            <li><a href="https://library.caltech.edu/privacy">Privacy</a></li>
            <li><a href="https://www.caltech.edu/claimed-copyright-infringement">Copyright</a></li>
            <li><a href="https://library.caltech.edu/accessibility">Accessibility</a></li>
            <li id="footer-login" class="libanswers-js libguides-js"><a href="https://caltech.libapps.com/libapps/login.php?site_id=64&amp;target64=L2xpYmd1aWRlcy9hZG1pbl9jLnBocD9nPTEyMTI1OTAmcD04ODY5MTAz" aria-label="Staff Login"><i class="fa fa-sign-in" aria-hidden="true"></i></a></li>
            </ul>
            </div>
        </footer>
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("custom-footer-link")) {
        e.target.style.textDecoration = "underline";
      }
    });
    this.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("custom-footer-link")) {
        e.target.style.textDecoration = "none";
      }
    });
  }
};
customElements.define("footer-global-lite", FooterGlobalLite);
export {
  FooterGlobalLite
};
