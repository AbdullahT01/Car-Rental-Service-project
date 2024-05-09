const googleMaps = require("@google/maps");
const googleMapsClient = googleMaps.createClient({
  key: "",
  Promise: Promise,
});

const findNearestBranch = (userLocation) => {
  return new Promise((resolve, reject) => {
    const branches = [
      {
        branchNumber: 1,
        mainBranch: true,
        branchAddress: "2311 Pl. Transcanadienne, Dorval, QC H9P 2X7",
        branchCoordinates: "45.478783720683225, -73.79033616625186",
      },
      {
        branchNumber: 2,
        mainBranch: false,
        branchAddress:
          "690 Bd René-Lévesque E Estates, Québec City, Quebec G1R 5A8",
        branchCoordinates: "46.81024553919734, -71.21810893650535",
      },
      {
        branchNumber: 3,
        mainBranch: false,
        branchAddress: "9101 Bd Ray-Lawson, Anjou, QC H1J 1K6",
        branchCoordinates: "45.62124971018465, -73.5641308862887",
      },
      {
        branchNumber: 4,
        mainBranch: false,
        branchAddress: "1872 Merivale Rd d, Nepean, ON K2G 1E6",
        branchCoordinates: "45.33362455499242, -75.72451283057421",
      },
      {
        branchNumber: 5,
        mainBranch: false,
        branchAddress: "947 Dovercourt Rd, Toronto, ON M6H 2X6",
        branchCoordinates: "43.6722329937224, -79.43145411594199",
      },
      {
        branchNumber: 6,
        mainBranch: false,
        branchAddress: "449 Gladstone Ave, Ottawa, ON K1R 5N7",
        branchCoordinates: "45.412662508713424, -75.69617547183954",
      },
      {
        branchNumber: 7,
        mainBranch: false,
        branchAddress: "1579 Cyrville Rd, Gloucester, ON K1B 3L7",
        branchCoordinates: "45.42333248784953, -75.61107385157035",
      },
      {
        branchNumber: 8,
        mainBranch: false,
        branchAddress: "2572 Bd Daniel-Johnson 2nd Floor, Laval, QC H7T 2R3",
        branchCoordinates: "45.57084628139844, -73.75691005994688",
      },
    ];
    let branchCoordinates = branches.map((obj) => obj.branchCoordinates);
    googleMapsClient
      .distanceMatrix({
        origins: [userLocation],
        destinations: branchCoordinates,
      })
      .asPromise()
      .then((response) => {
        const distances = response.json.rows[0].elements;
        let nearestDistance = Number.MAX_VALUE;
        let nearestBranchIndex = -1;
        distances.forEach((dist, index) => {
          if (dist.distance?.value < nearestDistance) {
            nearestDistance = dist.distance.value;
            nearestBranchIndex = index;
          }
        });
        if (nearestBranchIndex !== -1) {
          console.log(branches[nearestBranchIndex]);
          resolve(branches[nearestBranchIndex]);
        } else {
          console.log("No valid distances found");
          reject(new Error("No valid distances found"));
        }
      })
      .catch((err) => {
        console.log(err);
        reject(new Error("No valid distances found"));
      });
  });
};

exports.findNearestBranch = findNearestBranch;
