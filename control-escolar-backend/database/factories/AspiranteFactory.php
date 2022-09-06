<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Aspirante;
use App\Carrera;
use App\Plantel;
use Faker\Generator as Faker;
use Carbon\Carbon;
use Illuminate\Support\Str;

$factory->define(Aspirante::class, function (Faker $faker) {
    $planteles = Plantel::whereHas('municipio', function($query){
        $query->where('estado_id', 3);
    })->get()->pluck('id');

    $carreras = Carrera::whereHas('plantelCarrera', function($query) use ($planteles){
        $query->whereIn('plantel_id', [45]);
    })->get()->pluck('id');

    return [
        'nombre' => $faker->firstName,
        'primer_apellido' => $faker->lastName,
        'segundo_apellido' => $faker->lastName,
        'curp' => Str::upper(Str::random(18)),
        'fecha_nacimiento' => $faker->dateTimeBetween('-18 years', '-15 years'),
        'telefono' => $faker->randomNumber(),
        'correo' => $faker->unique()->safeEmail,
        'contrasena' => Str::upper(Str::random(6)),
        'dio_alta' => 'Control escolar',
        'plantel_id' => 45,
        'carrera_id' => $faker->randomElement($carreras),
        'fecha_alta' => Carbon::now(),
        'folio' => '1234567890',
    ];
});
