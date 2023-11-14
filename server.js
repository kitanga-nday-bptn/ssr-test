// @ts-check
require("@babel/register")({
    presets: ["@babel/preset-env", "@babel/preset-react"],
    "plugins": [
      [
        "transform-assets",
        {
          "extensions": [
            "css",
            "svg",
            'png',
            'jpg'
          ],
          "name": "static/media/[name].[hash:8].[ext]"
        }
      ]
    ]
  });
  const React = require("react");
  const ReactDOMServer = require("react-dom/server");
  const App = require("./src/App").default;
  const express = require("express");
  const path = require("path");
  const fs = require("fs");
  
  const app = express();
  
  app.get("/*", (req, res, next) => {
    console.log(`Request URL = ${req.url}`);
    if (req.url !== '/') {
      return next();
    }
    
    const structuredData = JSON.stringify({
        "@context" : "https://schema.org/",
        "@type" : "JobPosting",
        "title" : "Software Engineer",
        "description" : "<p>Google aspires to be an organization that reflects the globally diverse audience that our products and technology serve. We believe that in addition to hiring the best talent, a diversity of perspectives, ideas and cultures leads to the creation of better products and services.</p>",
        "identifier": {
          "@type": "PropertyValue",
          "name": "Google",
          "value": "1234567"
        },
        "datePosted" : "2017-01-18",
        "validThrough" : "2017-03-18T00:00",
        "employmentType" : "CONTRACTOR",
        "hiringOrganization" : {
          "@type" : "Organization",
          "name" : "Google",
          "sameAs" : "https://www.google.com",
          "logo" : "https://www.example.com/images/logo.png"
        },
        "jobLocation": {
        "@type": "Place",
          "address": {
          "@type": "PostalAddress",
          "streetAddress": "1600 Amphitheatre Pkwy",
          "addressLocality": "Mountain View",
          "addressRegion": "CA",
          "postalCode": "94043",
          "addressCountry": "US"
          }
        },
        "baseSalary": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": {
            "@type": "QuantitativeValue",
            "value": 40.00,
            "unitText": "HOUR"
          }
        }
      })
    
    const reactApp = ReactDOMServer.renderToString(React.createElement(App));
    console.log(reactApp);
    
    const indexFile = path.resolve("./build/index.html");
    fs.readFile(indexFile, "utf8", (err, data) => {
      if (err) {
        const errMsg = `There is an error: ${err}`;
        console.error(errMsg);
        return res.status(500).send(errMsg);
      }
  
      return res.send(
        data.replace('// ::STRUCTURED_DATA::', structuredData).replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
      );
    });
  });
  
  app.use(express.static(path.resolve(__dirname, "./build")));
  
  app.listen(8080, () =>
    console.log("Express server is running on localhost:8080")
  );