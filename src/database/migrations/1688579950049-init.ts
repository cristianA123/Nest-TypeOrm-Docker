import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1688579950049 implements MigrationInterface {
    name = 'Init1688579950049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rooms" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "price" double precision NOT NULL, "available" boolean NOT NULL, "type_room_id" integer, "hotel_id" integer, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotels" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255), "address" character varying(255), "email" character varying(255), "rating" character varying(255), "city_id" integer, CONSTRAINT "UQ_bf2e1d96bdc6d87b1713070de24" UNIQUE ("email"), CONSTRAINT "REL_7a841d270a1ef2ec9476110b7d" UNIQUE ("city_id"), CONSTRAINT "PK_2bb06797684115a1ba7c705fc7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "type_room" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "PK_30a5fe46b9c3552a816081a2720" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."cities_name_enum" AS ENUM('Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Huancayo', 'Tacna', 'Cajamarca', 'Pucallpa', 'Tumbes', 'Huaraz')`);
        await queryRunner.query(`CREATE TABLE "cities" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" "public"."cities_name_enum" NOT NULL DEFAULT 'Lima', "countryId" integer, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "countries" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "qualities" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "image_id" integer, CONSTRAINT "REL_f5a8b88ff8907500a36e5dac24" UNIQUE ("image_id"), CONSTRAINT "PK_9318d6be2c65a38b149055ce361" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "public_id" character varying(255) NOT NULL, "secure_url" character varying(255) NOT NULL, "room_id" integer, "hotel_id" integer, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."roles_name_enum" AS ENUM('admin', 'user', 'owner', 'super_admin')`);
        await queryRunner.query(`CREATE TABLE "roles" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" "public"."roles_name_enum" NOT NULL DEFAULT 'user', "description" character varying(255) NOT NULL, CONSTRAINT "UQ_6521db71370e3fecb07064ce930" UNIQUE ("description"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255), "phone" character varying(255), "birthdate" date, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "recovery_token" character varying(255), "refresh_token" character varying(255), "role_id" integer, "source_id" integer, "image_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_b1aae736b7c5d6925efa856352" UNIQUE ("image_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "source" ("status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "UQ_e64619e22dc97d6525c86ef8af5" UNIQUE ("name"), CONSTRAINT "UQ_e64619e22dc97d6525c86ef8af5" UNIQUE ("name"), CONSTRAINT "UQ_52959d2d0ce88be7dfb8e01443f" UNIQUE ("description"), CONSTRAINT "PK_018c433f8264b58c86363eaadde" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rooms_qualities" ("room_id" integer NOT NULL, "quality_id" integer NOT NULL, CONSTRAINT "PK_bb4179cb5977fbce494629d1ed8" PRIMARY KEY ("room_id", "quality_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e2a1724d84108e333348fc24ee" ON "rooms_qualities" ("room_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0063e03acfe19621e581cb5cd6" ON "rooms_qualities" ("quality_id") `);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_a33752aed358f23991836c236d0" FOREIGN KEY ("type_room_id") REFERENCES "type_room"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_7a61484af364d0d804b21b25c7f" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "FK_7a841d270a1ef2ec9476110b7db" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_b5f9bef6e3609b50aac3e103ab3" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "qualities" ADD CONSTRAINT "FK_f5a8b88ff8907500a36e5dac249" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_1584086cb823cdf223dbf9ded3e" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_de3605b7d4d45d88b94db3a8550" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6b129e2863f0568bf8592bb3b0b" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b1aae736b7c5d6925efa8563527" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rooms_qualities" ADD CONSTRAINT "FK_e2a1724d84108e333348fc24ee1" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms_qualities" ADD CONSTRAINT "FK_0063e03acfe19621e581cb5cd65" FOREIGN KEY ("quality_id") REFERENCES "qualities"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms_qualities" DROP CONSTRAINT "FK_0063e03acfe19621e581cb5cd65"`);
        await queryRunner.query(`ALTER TABLE "rooms_qualities" DROP CONSTRAINT "FK_e2a1724d84108e333348fc24ee1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b1aae736b7c5d6925efa8563527"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6b129e2863f0568bf8592bb3b0b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_de3605b7d4d45d88b94db3a8550"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_1584086cb823cdf223dbf9ded3e"`);
        await queryRunner.query(`ALTER TABLE "qualities" DROP CONSTRAINT "FK_f5a8b88ff8907500a36e5dac249"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_b5f9bef6e3609b50aac3e103ab3"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "FK_7a841d270a1ef2ec9476110b7db"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_7a61484af364d0d804b21b25c7f"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_a33752aed358f23991836c236d0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0063e03acfe19621e581cb5cd6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2a1724d84108e333348fc24ee"`);
        await queryRunner.query(`DROP TABLE "rooms_qualities"`);
        await queryRunner.query(`DROP TABLE "source"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "qualities"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TYPE "public"."cities_name_enum"`);
        await queryRunner.query(`DROP TABLE "type_room"`);
        await queryRunner.query(`DROP TABLE "hotels"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
    }

}
