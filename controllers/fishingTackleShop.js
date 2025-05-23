const createHttpError = require('http-errors');
const FishingTackleShopModel = require ('../models/fishingTackleShop');

const googleMapKey = process.env.GOOGLE_MAP_API
const googleMapsUri = "https://places.googleapis.com/v1/places:searchText"

async function fetchGoogleMap(textQuery,nextPageToken=''){

    const myHeaders = new Headers();
    myHeaders.append("X-Goog-FieldMask", "places.formattedAddress,places.id,places.location,places.googleMapsUri,places.displayName.text,places.nationalPhoneNumber,nextPageToken");
    myHeaders.append("X-Goog-Api-Key", googleMapKey);
    myHeaders.append("Content-Type", "application/json");

    let body = {
        "textQuery": textQuery,
        "languageCode": "zh-TW",
        "pageToken":nextPageToken
    }

    if(nextPageToken=='') delete body.pageToken

    const raw = JSON.stringify(body);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch(googleMapsUri, requestOptions)
        .then((response) => {
            return response.json()
        })
        
}

const getFishingTackleShopFromGoogle = async (_req, res, next) => {

    try {
            const textQuery ="台中 釣具店"
            let FishingTackleShopList = []
            
            for(let i = 0; i < 3; i++){
                let PageToken = ''
                const data = await fetchGoogleMap(textQuery,PageToken)
                FishingTackleShopList=[...FishingTackleShopList,...data.places]
                if(data.nextPageToken) PageToken = data.nextPageToken
            }
            
            
        function createFishingTackleShop () {
            let qty = 0

            FishingTackleShopList.forEach(async item => {
                qty++
                await FishingTackleShopModel.create({
                    placesId:item.id,
                    address:item.formattedAddress,
                    googleMapsUri:item.googleMapsUri,
                    name:item.displayName.text,
                    phone:item.nationalPhoneNumber,
                    locations:{
                        type: "Point",
                        coordinates: [
                            item.location.longitude,
                            item.location.latitude
                        ],
                    },
                })
            })

            res.send({
                status: true,
                message:`新增${qty}筆資料`
            });
        }

        await createFishingTackleShop ()

        // res.send({
        //     status: true,
        //     message:`新增${qty}筆資料`
        // });


    } catch (error) {
        next(error);
    }
    
}

const getFishingTackleShopList = async (req, res, next) => {

    try {
        const result = await FishingTackleShopModel.find({
            status: 1
        })
        
    
        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
}

const getFishingTackleShopById = async (req, res, next) => {
    try {
        const result = await FishingTackleShopModel.findOne({
            _id: req.params.id,
            status: 1
        })
        if (!result) {
            throw createHttpError(404, '此釣具店不存在');
        }
    
        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
}

const createOneFishingTackleShop = async (req, res, next) => {
    try {
        const {
            placesId,
            address,
            googleMapsUri,
            status,
            name,
            phone,
            locations,
        } = req.body;

        const result = await FishingTackleShopModel.create({
            placesId,
            address,
            googleMapsUri,
            status,
            name,
            phone,
            locations,
        })
        

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
}

const updateFishingTackleShopById = async (req, res, next) => {
    try {
        const {
            placesId,
            address,
            googleMapsUri,
            status,
            name,
            phone,
            locations,
        } = req.body;

        const result = await FishingTackleShopModel.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                placesId,
                address,
                googleMapsUri,
                status,
                name,
                phone,
                locations,
            },
            {
                new: true,
                runValidators: true
            }
        )
        if (!result) {
            throw createHttpError(404, '此釣具店不存在');
        }

        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
}

const deleteFishingTackleShopById = async (req, res, next) => {
    try {
            const result = await FishingTackleShopModel.findByIdAndUpdate(
                req.params.id,
                {
                    status: -1
                },
                {
                    new: true,
                    runValidators: true
                }
            )
            if (!result) {
                throw createHttpError(404, '此釣具店不存在');
            }
    
            res.send({
                status: true,
                result
            });
        } catch (error) {
            next(error);
        }
}


module.exports = {
    getFishingTackleShopFromGoogle,
    getFishingTackleShopList,
    getFishingTackleShopById,
    createOneFishingTackleShop,
    updateFishingTackleShopById,
    deleteFishingTackleShopById
}