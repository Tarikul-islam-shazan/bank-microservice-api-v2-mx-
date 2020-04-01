import jsonTransformer from 'jsonata';

export class VAResponseMapper {
  static vaDTO(response: any) {
    const template = `{
      "info": info,
      "session": session,
      "result": result.content,
      "inteface": result.interface
    }`;
    return jsonTransformer(template).evaluate(response);
  }
}
