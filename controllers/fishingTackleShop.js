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
        const city = _req.params.city
        const cityList = ["基隆市", "臺北市", "新北市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣"]
        if(!city) {
            throw createHttpError(404, '請輸入城市');
        }
        if(!cityList.includes(city)){
            throw createHttpError(404, '輸入格式錯誤');
        }
        const textQuery =`${city} 釣具店`
        let FishingTackleShopList = []
            
        let PageToken = ''
        for(let i = 0; i < 3; i++){
            const data = await fetchGoogleMap(textQuery,PageToken)
            FishingTackleShopList=[...FishingTackleShopList,...data.places]
            if(data.nextPageToken) PageToken = data.nextPageToken
        }

        function removeDuplicates(arr) {
            return [...new Set(arr)];
        }
        removeDuplicates(FishingTackleShopList)  
            
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
                    city:city
                })
            })

            res.send({
                status: true,
                message:`新增${qty}筆資料`
            });
        }

        await createFishingTackleShop ()

        

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
            city,
        } = req.body;

        const result = await FishingTackleShopModel.create({
            placesId,
            address,
            googleMapsUri,
            status,
            name,
            phone,
            locations,
            city,
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
            city,
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
                city,
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