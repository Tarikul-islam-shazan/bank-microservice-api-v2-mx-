export const meedExtraRegistrationReq = `{
			"first_name": firstName,
			"last_name": lastName,
			"username": username,
			"email": emailAddress,
			"confirm_email": emailAddress,
			"password": "Meed#1" & userId,
			"confirm_password": "Meed#1" & userId,
			"state": state,
			"zip": zipCode,
			"opted_in": "f"
		}`;

export const personalInfoResForMeedExtra = `$.{
			"firstName": FirstName,
			"lastName": LastName,
			"state": CountrySubdivision,
			"zipCode": Address.PostCode,
			"emailAddress": EmailAddress
		}`;

export const affinityCategories = `[$]`;

export const affinityOffers = `[$.{
		"id": id,
		"activated": value.activated = "t"? true: value.activated = "f"? false,
		"title": value.xname,
		"merchant": value.xpartname,
		"image": value.xpic1 ? "https://uat.affinity-deals.com/common/images/" & value.xpic1,
		"shopType": value.shop_type[0],
		"tenWord": value.xtenword,
		"twentyWord": value.xtwentyword,
		"outsideLink": value.xoutsidelink,
		"expiration": value.xexpiration,
		"merchantId": value.xpartid,
		"requiresActivation": value.requires_activation = "t" ? true : false,
		"offerValue": value.offervalue
	}]`;

export const affinityActivateOffer = `$.{
		"id": id,
		"activated": value.activated = "t" ? true : false,
		"title": value.xname,
		"merchant": value.xpartname,
		"image": "https://uat.affinity-deals.com/common/images/" & value.xpic1,
		"shopType": value.shop_type[0],
		"tenWord": value.xtenword,
		"twentyWord": value.xtwentyword,
		"outsideLink": value.xoutsidelink,
		"expiration": value.xexpiration,
		"merchantId": value.xpartid,
		"requiresActivation": value.requires_activation = "t" ? true : false,
		"offerValue": value.offervalue
	}`;

export const affinityOfferDetails = `$.{
		"id": id,
		"activated": value.activated = "t" ? true : false,
		"title": value.xname,
		"merchant": value.xpartname,
		"image": "https://uat.affinity-deals.com/common/images/" & value.xpic1,
		"shopType": value.shop_type[0],
		"tenWord": value.xtenword,
		"twentyWord": value.xtwentyword,
		"outsideLink": value.xoutsidelink,
		"expiration": value.xexpiration,
		"merchantId": value.xpartid,
		"requiresActivation": value.requires_activation = "t" ? true : false,
		"stores": [value.xstores.{
			"id": id,
			"address": value.addr,
			"city": value.city,
			"zip": value.zip,
			"lat": value.lat,
			"long": value.long,
			"distance": value.distance
		}],
		"offerValue": value.offervalue
	}`;
