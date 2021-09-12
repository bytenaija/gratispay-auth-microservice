import { ApiPropertyName } from '../../decorators/api.decorators';

export class LoginDto {
  @ApiPropertyName('password')
  password: string;
  @ApiPropertyName('username')
  username: string;
}
