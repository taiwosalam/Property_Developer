import api from "@/services/api";

export const transformFormData = (
    formData: FormData,
    keyMap: Record<string, string> = {}
  ): Record<string, any> => {
    const transformedData: Record<string, any> = {};

    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log('Processing key:', key);
      console.log('KeyMap contains key?', key in keyMap);
      
      const mappedKey = keyMap[key] || key;
      transformedData[mappedKey] = value;
    });
    return transformedData;
  };

export const createPropertyRequest = async (data: FormData | Record<string, any>) => {
    const keyMapping: Record<string, string> = {
        'content': 'description',
        'propertyCategory': 'property_category',
        'propertyType': 'property_type',
        'propertySubType': 'property_sub_type',
        'targetAudience': 'target_audience',
        'minBudget': 'min_budget',
        'maxBudget': 'max_budget',
        'validTill': 'valid_till'
    };
    
    const transformedData = data instanceof FormData 
        ? transformFormData(data, keyMapping)
        : Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                keyMapping[key] || key,
                value
            ])
          );
    
    // Format the data to match the required structure
    const formattedData = {
        title: transformedData.title || '',
        description: transformedData.description || '',
        property_category: transformedData.property_category || '',
        property_type: transformedData.property_type || '',
        property_sub_type: transformedData.property_sub_type || '',
        target_audience: transformedData.target_audience 
            ? (typeof transformedData.target_audience === 'string' 
                ? transformedData.target_audience.split(',') 
                : Array.isArray(transformedData.target_audience)
                    ? transformedData.target_audience
                    : [transformedData.target_audience])
            : [],
        min_budget: transformedData.min_budget?.toString() || '',
        max_budget: transformedData.max_budget?.toString() || '',
        valid_till: transformedData.valid_till || ''
    };

    // const formattedData = {
    //     "title": "A Property  request ",
    //     "description": " this is a test Property request",
    //     "property_category": "Residential", //{from dropdown ['Residential', 'Commercial', 'Mixed Use']}
    //     "property_type": "Flat", //{from dropdown ['Apartment', 'Flat', 'House', 'Land']}
    //     "property_sub_type": "rent", 
    //     "target_audience": ["Lagos", "Oyo", "Abuja"],
    //    "min_budget": "300000",
    //    "max_budget": "550000",
    //     "valid_till": "2024-11-10 - 2024-12-20" 
    //   }
    
    // console.log('Payload to be sent to API:', formattedData);
    
    try {
        const response = await api.post("/agent-community/property-requests/create", formattedData);
        return response.status === 200 || response.status === 201;
    } catch (error) {
        console.error("Error creating property request:", error);
        throw error;
    }
}

// DONE WITH CREATEPROPERTYREQUEST 